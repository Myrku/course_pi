using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Astro.Logging
{
    public static class Logger
    {
        private const string dirName = "logs";
        private static FileStream GetFileForSaveLog()
        {
            var path = $"{dirName}\\log_{DateTime.UtcNow:MM_dd_yyyy}.txt";
            if (!Directory.Exists(dirName))
                Directory.CreateDirectory(dirName);

            return new FileStream(path, FileMode.OpenOrCreate);
        }

        public static async void LogError(string message, Exception exception = null)
        {
            try
            {
                var fileStream = GetFileForSaveLog();

                using var writer = new StreamWriter(fileStream, System.Text.Encoding.Default);
                string text;
                if (exception != null)
                {
                    StackTrace trace = new StackTrace(exception, true);

                    var fileName = trace.GetFrame(0).GetMethod().ReflectedType.FullName;
                    var line = trace.GetFrame(0).GetFileLineNumber();

                    text = $"Error ------ {DateTime.UtcNow} ----- {fileName}:{line} ----- {message}";
                }
                else
                {
                    text = $"Error ------ {DateTime.UtcNow} ----- {message}";
                }
                await writer.WriteLineAsync(text);
            }
            catch
            {
                return;
            }
        }
    }
}
