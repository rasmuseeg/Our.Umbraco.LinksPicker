# Our.Umbraco.LinksPicker
Multiple Url/Link PropertyEditor with type converter



## Installation

### NUGET:
```
PM > Install-Package Our.Umbraco.Picture
```

OUR:
Dowload the package from here:
https://our.umbraco.org/projects/developer-tools/links-picker/
or from the umbraco backoffice.

## How to use

Create a new datatype as Links Picker, select the new datatype as a property editor on a document type.

```
@model Our.Umbraco.Models.LinkPickerModel
@{ 
    if (Model.Any())
    {
        foreach(var link in Model)
        {
            <a href="@link.Url" target="@link.Target">@link.Name</a>
        }
    }
}
```
