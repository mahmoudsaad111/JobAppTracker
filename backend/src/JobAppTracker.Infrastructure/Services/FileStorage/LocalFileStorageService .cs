using System;
using System.Collections.Generic;
using System.Text;
using JobAppTracker.Application.Interfaces.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace JobAppTracker.Infrastructure.Services.FileStorage
{
    public class LocalFileStorageService : IFileStorageService
    {
        private readonly string _root;

        public LocalFileStorageService(IConfiguration config)
        {
            // Add "FileStorage:LocalPath" in appsettings.json
            // e.g. "FileStorage": { "LocalPath": "wwwroot/uploads" }
            _root =
                config["FileStorage:LocalPath"]
                ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");

            Directory.CreateDirectory(_root);
        }

        public async Task<string> SaveAsync(IFormFile file, string folder)
        {
            var dir = Path.Combine(_root, folder);
            Directory.CreateDirectory(dir);

            var ext = Path.GetExtension(file.FileName);
            var fileName = $"{Guid.NewGuid()}{ext}";
            var fullPath = Path.Combine(dir, fileName);

            Console.WriteLine($"=== FILE SAVE DEBUG ===");
            Console.WriteLine($"_root:     {_root}");
            Console.WriteLine($"dir:       {dir}");
            Console.WriteLine($"fullPath:  {fullPath}");
            Console.WriteLine($"exists after save: will check below");

            await using var stream = File.Create(fullPath);
            await file.CopyToAsync(stream);

            Console.WriteLine($"File exists: {File.Exists(fullPath)}");
            Console.WriteLine($"Returning:   /uploads/{folder}/{fileName}");

            return $"/uploads/{folder}/{fileName}";
        }

        public Task DeleteAsync(string filePath)
        {
            // filePath is like /uploads/documents/abc.pdf
            var relative = filePath.TrimStart('/').Replace('/', Path.DirectorySeparatorChar);
            var fullPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", relative);

            if (File.Exists(fullPath))
                File.Delete(fullPath);

            return Task.CompletedTask;
        }
    }
}
