using Astro.Models;
using Astro.Models.Statuses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Astro.Services.Interfaces
{
    public interface IUserService
    {
        UserPageContext GetContext();
        ActionResultStatus SetCamera(CameraInfo cameraInfo);
        CameraInfo GetUserCamera();
        string GetUserNameById(int userId);
    }
}
