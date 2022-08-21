import { parse, stringify } from "https://deno.land/x/xml@2.0.4/mod.ts";

/**
 * Create a feed skeleton without entries.
 * @param  {string} id Feed URL.
 * @param  {string} title Feed title.
 * @param  {string=} author Feed author.
 * @param  {string=} icon Feed icon.
 * @returns {object} Feed skeleton.
 */
function create(id, title, author, icon) {
  const feed = {
    xml: { "@version": "1.0", "@encoding": "utf-8" },
    feed: {
      "@xmlns": "http://www.w3.org/2005/Atom",
      title: title,
      id: id,
      updated: new Date().toISOString(),
      link: { "@rel": "self", "@href": id, "#text": null },
    },
  };

  if (author !== undefined) {
    feed["feed"]["author"] = { name: author };
  }
  if (icon !== undefined) {
    feed["feed"]["icon"] = icon;
  }
  feed["feed"]["entry"] = [];

  return feed;
}
/**
 * Add a entry to a feed skeleton.
 * @param  {string} feed Feed skeleton.
 * @param  {string} id Entry URL.
 * @param  {string} title Entry title.
 * @param  {string} updated Entry update time.
 * @param  {string=} author Entry author.
 * @param  {string=} content Entry content.
 * @param  {string=} summary Entry summary.
 */
function add(feed, id, title, updated, author, content, summary) {
  const entry = {
    id: id,
    title: title,
    updated: updated,
    link: { "@rel": "alternate", "@href": id, "#text": null },
  };

  if (author !== undefined) {
    entry["author"] = { name: author };
  }
  if (content !== undefined) {
    entry["content"] = content;
  }
  if (summary !== undefined) {
    entry["summary"] = summary;
  }

  feed["feed"]["entry"].push(entry);
}

export { add, create, stringify as parse };
