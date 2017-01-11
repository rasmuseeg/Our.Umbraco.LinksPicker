using Newtonsoft.Json;
using Our.Umbraco.LinksPicker.Models;
using System;
using Umbraco.Core;
using Umbraco.Core.Logging;
using Umbraco.Core.Models.PublishedContent;
using Umbraco.Core.PropertyEditors;
using Umbraco.Web;

namespace Our.Umbraco.LinksPicker.PropertyConverters {
    [PropertyValueType(typeof(LinksPickerModel))]
    [PropertyValueCache(PropertyCacheValue.All, PropertyCacheLevel.Request)]
    public class LinksPickerPropertyValueConverter : IPropertyValueConverter {
        public bool IsConverter(PublishedPropertyType propertyType) {
            return propertyType.PropertyEditorAlias == "Our.LinksPicker";
        }

        public object ConvertDataToSource(PublishedPropertyType propertyType, object source, bool preview) {
			var attemptConvertInt = source.TryConvertTo<string>();
			if (attemptConvertInt.Success)
			{
				return attemptConvertInt.Result;
			}

			return null;
		}

		public object ConvertSourceToObject(PublishedPropertyType propertyType, object source, bool preview) {
			var fallback = new LinksPickerModel();

			if (source == null || UmbracoContext.Current == null)
				return fallback;

			var model = JsonConvert.DeserializeObject<Models.LinksPickerModel>(source.ToString());

			foreach (var link in model)
			{
				// If we've got a id, then it's internal
				if (link.Id.HasValue && link.Id.Value > 0)
				{
					try
					{
						var umbHelper = new UmbracoHelper(UmbracoContext.Current);
						link.Content = (
							link.IsMedia
							? umbHelper.TypedMedia(link.Id)
							: umbHelper.TypedContent(link.Id)
						);

						link.Url = link.Content.Url;
					}
					catch (Exception ex)
					{
						LogHelper.Error<LinksPickerPropertyValueConverter>(string.Format("Failed to map content with id: {0} for property {1} on content type {2}", link.Id, propertyType.PropertyEditorAlias, propertyType.ContentType.Alias), ex);
					}
				}
			}

			return model;
		}

        public object ConvertSourceToXPath(PublishedPropertyType propertyType, object source, bool preview) {
			return source.ToString();
        }
    }
}
