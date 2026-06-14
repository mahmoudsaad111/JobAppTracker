using System;
using System.Collections.Generic;
using System.Text;

namespace JobAppTracker.Domain.Enums
{
    public enum ContentType
    {
        PDF,
        Word, // .doc
        WordOpenXML, // .docx
        Text,
        ImageJPEG,
        ImagePNG,
        ImageGIF,
        Zip,
        Other,
    }
}
