import { FC, useCallback, useEffect, useState } from "react";
import EpubReader, { Highlight } from "../components/reader";
import client from "../api/Client";
import { useParams, useSearchParams } from "react-router-dom";
import { debounce, parseError } from "../utils/helper";

interface Props {}

interface BookAPIResponse {
  settings:Settings
  url: string;
}

type Settings = { highlights: Highlight[]; lastLocation: string };
const updateLastLocation = (bookId: string, lastLocation: string) => {
  client.post("/history", {
    bookId,
    lastLocation,
    remove: false,
  });
};
const debounceUpdateLastLocation = debounce(updateLastLocation, 500);

const ReadingPage: FC<Props> = () => {
  const [url, setUrl] = useState("");
  const [settings, setSettings] = useState<Settings>({highlights: [], lastLocation: ""});
  const { slug } = useParams();
  const [searchParam] = useSearchParams();
  const title = searchParam.get("title");
  const bookId = searchParam.get("id");

  const handleOnHighlightSelection = (data: Highlight) => {
    try {
      setSettings({...settings, highlights: [...settings.highlights, data]});
      client.post("/history", {
        bookId,
        highlights: [data],
        remove: false,
      });
    } catch (error) {
      parseError(error);
    }
  };

  const handleOnHighlightClear = (cfi: string) => {
    try {
      const newHighlight = settings.highlights.filter((item) => item.selection !== cfi);
      setSettings({...settings, highlights: newHighlight});
      client.post("/history", {
        bookId,
        highlights: [{ selection: cfi, fill: "" }],
        remove: true,
      });
    } catch (error) {
      parseError(error);
    }
  };

  const handleLocationChanged = useCallback((location: string) => {
    try {
      if (bookId) debounceUpdateLastLocation(bookId, location);
    } catch (error) {
      parseError(error);
    }
  }, [bookId]);

  useEffect(() => {
    if (!slug) return;
    const fetchBookUrl = async () => {
      try {
        const { data } = await client.get<BookAPIResponse>(
          `/book/read/${slug}`
        );
        const res = await client.get(data.url, { responseType: "blob" });
        setUrl(res.data);
        setSettings(data.settings);
        // console.log(data.settings.highlights);
      } catch (error) {
        parseError(error);
      }
    };
    fetchBookUrl();
  }, [slug]);

  return (
    <div>
      <EpubReader
        url={url}
        title={title || ""}
        highlights={settings.highlights}
        lastLocation={settings.lastLocation}
        onHighlight={handleOnHighlightSelection}
        onHighlightClear={handleOnHighlightClear}
        onLocationChanged={handleLocationChanged}
      />
    </div>
  );
};

export default ReadingPage;
