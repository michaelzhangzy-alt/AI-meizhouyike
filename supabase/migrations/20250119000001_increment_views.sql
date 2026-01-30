
-- Increment article views function
CREATE OR REPLACE FUNCTION increment_article_views(article_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE articles
  SET views = views + 1
  WHERE id = article_id;
END;
$$;

GRANT EXECUTE ON FUNCTION increment_article_views TO anon;
GRANT EXECUTE ON FUNCTION increment_article_views TO authenticated;
