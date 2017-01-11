using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using Umbraco.Core.Logging;
using Umbraco.Core.Models;

namespace Our.Umbraco.LinksPicker.Models {
    public class LinksPickerModel : List<LinksPickerItem>
    {
        public LinksPickerModel() 
            : base() { }

        public LinksPickerModel(string value) : base() {
            if (string.IsNullOrEmpty(value))
                throw new ArgumentNullException("value", "Value cannot be null or empty.");

            try {
                var links = JsonConvert.DeserializeObject<List<LinksPickerItem>>(value);
                base.AddRange(links);
            } catch (Exception ex) {
                LogHelper.Error<LinksPickerModel>("Faile to deserialize: " + value, ex);
            }
        }
    }

    public class LinksPickerItem
    {
		/// <summary>
		/// Gets or sets the id of the PublishedContent
		/// </summary>
        [JsonProperty("id")]
        public int? Id { get; set; }

		/// <summary>
		/// Gets or sets the name defined in the overlay
		/// </summary>
        [JsonProperty("name")]
        public string Name { get; set; }

		/// <summary>
		/// Gets or sets the target: _blank, _self etc.
		/// </summary>
        [JsonProperty("target")]
        public string Target { get; set; }

		/// <summary>
		/// Gets or sets the url
		/// </summary>
        [JsonProperty("url")]
        public string Url { get; set; }

		/// <summary>
		/// Gets or sets wether the current selected link is media or content
		/// </summary>
        [JsonProperty("isMedia")]
        public bool IsMedia { get; set; }

		/// <summary>
		/// Gets or sets the current PublishedContent
		/// </summary>
        public IPublishedContent Content { get; set; }

        public LinksPickerItem() {
            Content = null;
        }
    }
}