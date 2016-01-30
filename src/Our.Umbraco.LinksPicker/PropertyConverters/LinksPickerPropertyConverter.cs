using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using Umbraco.Core.Logging;
using Umbraco.Core.Models.PublishedContent;
using Umbraco.Core.PropertyEditors;
using Umbraco.Web;

namespace Our.Umbraco.LinksPicker.PropertyConverters
{
    [PropertyValueType(typeof(Models.LinksPicker))]
    [PropertyValueCache(PropertyCacheValue.All, PropertyCacheLevel.Request)]
    public class LinksPickerPropertyValueConverter : PropertyValueConverterBase
    {
        public UmbracoHelper umbHelper;

        public LinksPickerPropertyValueConverter()
        {
            umbHelper = new UmbracoHelper(UmbracoContext.Current);
        }

        /// <summary>
        /// Checks if this converter can convert the property editor and registers if it can.
        /// </summary>
        /// <param name="propertyType">
        /// The published property type.
        /// </param>
        /// <returns>
        /// The <see cref="bool"/>.
        /// </returns>
        public override bool IsConverter(PublishedPropertyType propertyType)
        {
            return propertyType.PropertyEditorAlias == "Our.LinksPicker";
        }

        /// <summary>
        /// Convert the raw string into a nodeId integer array
        /// </summary>
        /// <param name="propertyType">
        /// The published property type.
        /// </param>
        /// <param name="source">
        /// The value of the property
        /// </param>
        /// <param name="preview">
        /// The preview.
        /// </param>
        /// <returns>
        /// The <see cref="object"/>.
        /// </returns>
        public override object ConvertDataToSource(PublishedPropertyType propertyType, object source, bool preview)
        {
            if (source == null) return new Models.LinksPicker();
            var sourceString = source.ToString();

            var links = JsonConvert.DeserializeObject<Models.LinksPicker>(sourceString);

            foreach (var link in links)
            {
                // If we've got a id, then it's internal
                if(link.Id.HasValue && link.Id.Value > 0)
                {
                    try
                    {
                        link.Content = (
                            link.IsMedia
                            ? umbHelper.TypedMedia(link.Id)
                            : umbHelper.TypedContent(link.Id)
                        );

                        link.Url = link.Content.Url;
                    }
                    catch (Exception e)
                    {
                        LogHelper.Error(this.GetType(), "Failed to map link with id: " + link.Id, e);
                    }
                }
            }

            return links;
        }

        /// <summary>
        /// Convert the source nodeId into a IEnumerable of IPublishedContent (or DynamicPublishedContent)
        /// </summary>
        /// <param name="propertyType">
        /// The published property type.
        /// </param>
        /// <param name="source">
        /// The value of the property
        /// </param>
        /// <param name="preview">
        /// The preview.
        /// </param>
        /// <returns>
        /// The <see cref="object"/>.
        /// </returns>
        public override object ConvertSourceToObject(PublishedPropertyType propertyType, object source, bool preview)
        {
            if (source == null)
                return new Models.LinksPicker();

            // source should come from ConvertDataToSource and be a string (or null) already
            return source ?? new Models.LinksPicker();
        }

        public override object ConvertSourceToXPath(PublishedPropertyType propertyType, object source, bool preview)
        {
            // source should come from ConvertDataToSource and be a string (or null) already
            throw new NotImplementedException();
        }
    }
}
