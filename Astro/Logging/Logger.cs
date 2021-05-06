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
        private static FileStream GetFileForSaveLog()
        {
            var path = $"logs/log_{DateTime.UtcNow:MM:dd:yyyy}.txt";
            if (!Directory.Exists("logs"))
                Directory.CreateDirectory("logs");
            if (!File.Exists(path)) 
                return File.Create(path);
            return new FileStream(path, FileMode.Open);
        }

        public static async void LogError(string message, Exception exception = null)
        {
            try
            {
                var fileStream = GetFileForSaveLog();

                using (var writer = new StreamWriter(fileStream, System.Text.Encoding.Default))
                {
                    string text;
                    if(exception != null)
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
            }
            catch()
            {
                return;
            }
        }
    }
}
