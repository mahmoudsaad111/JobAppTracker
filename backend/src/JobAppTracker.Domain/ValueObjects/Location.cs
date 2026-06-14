using System;
using System.Collections.Generic;
using System.Text;

namespace JobAppTracker.Domain.ValueObjects
{
    public class Location
    {
        public string Country { get; }
        public string City { get; }
        public string Street { get; }
        public int PostalCode { get; }

        public Location(string country, string city, string street, int postalCode)
        {
            Country = country;
            City = city;
            Street = street;
            PostalCode = postalCode;
        }
    }
}
