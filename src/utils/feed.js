import * as xml from "xml";

class Feed {
  /**
   * Create a feed.
   * @param {object} metadata Metadata for the feed.
   * @param {string} metadata.id
   * @param {string} metadata.link
   * @param {string} metadata.title
   * @param {string} [metadata.author]
   * @param {string} [metadata.icon]
   */
  constructor(metadata) {
    this.feed = {
      xml: { "@version": "1.0", "@encoding": "utf-8" },
      feed: {
        "@xmlns": "http://www.w3.org/2005/Atom",
        title: metadata["title"],
        id: metadata["id"],
        updated: new Date().toISOString(),
        link: { "@rel": "self", "@href": metadata["link"], "#text": null },
      },
    };

    if (metadata["author"] !== undefined) {
      this.feed["feed"]["author"] = { name: metadata["author"] };
    }
    if (metadata["icon"] !== undefined) {
      this.feed["feed"]["icon"] = metadata["icon"];
    }
    this.feed["feed"]["entry"] = [];
  }

  /**
   * Add a entry.
   * @param {object} metadata Feed entry metadata.
   * @param {string} metadata.id
   * @param {string} metadata.title
   * @param {string} metadata.updated
   * @param {string} [metadata.author]
   * @param {string} [metadata.content]
   * @param {string} [metadata.summary]
   */
  add(metadata) {
    const entry = {
      id: metadata["id"],
      title: metadata["title"],
      updated: metadata["updated"],
      link: { "@rel": "alternate", "@href": metadata["id"], "#text": null },
    };

    if (metadata["author"] !== undefined) {
      entry["author"] = { name: metadata["author"] };
    }
    if (metadata["content"] !== undefined) {
      entry["content"] = metadata["content"];
    }
    if (metadata["summary"] !== undefined) {
      entry["summary"] = metadata["summary"];
    }

    this.feed["feed"]["entry"].push(entry);
  }

  /**
   * Build the feed.
   * @returns {string}
   */
  build() {
    return xml.stringify(this.feed);
  }
}

export { Feed };
