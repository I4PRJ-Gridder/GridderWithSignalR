using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace Gitter.Hubs
{
    public class GridHub : Hub
    {
        public async Task UpdateGrid(int x, int y, string colour)
        {
            await Clients.All.SendAsync("drawPixel", x, y, colour);
        }
    }
}
