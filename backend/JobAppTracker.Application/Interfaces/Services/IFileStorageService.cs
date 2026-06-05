using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.AspNetCore.Http;

namespace JobAppTracker.Application.Interfaces.Services
{
    public interface IFileStorageService
    {
        /// <summary>Saves the file and returns the stored path/URL.</summary>
        Task<string> SaveAsync(IFormFile file, string folder);

        /// <summary>Deletes the file at the given path/URL.</summary>
        Task DeleteAsync(string filePath);
    }
}
