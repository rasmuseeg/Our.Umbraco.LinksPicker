using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using Umbraco.Core.Models;

namespace Our.Umbraco.LinksPicker.Models {
    public class LinksPicker : List<LinksPickerItem>
    {
        public LinksPicker() 
            : base() { }

        public LinksPicker(string value) 
            : base() {
            if (string.IsNullOrEmpty(value))
                throw new ArgumentNullException("value", "Value cannot be null or empty.");

                var links = JsonConvert.DeserializeObject<List<LinksPickerItem>>(value);
                base.AddRange(links);
        }
    }

    public class LinksPickerItem
    {
        [JsonProperty("id")]
        public int? Id { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("target")]
        public string Target { get; set; }

        [JsonProperty("url")]
        public string Url { get; set; }

        [JsonProperty("isMedia")]
        public bool IsMedia { get; set; }

        public IPublishedContent Content { get; set; }
    }
}