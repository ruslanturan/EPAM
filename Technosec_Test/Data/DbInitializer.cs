using System;
using System.Linq;

namespace Technosec_Test.Data
{
	public class DbInitializer
	{
        public static void Initialize(Context context)
        {
            context.Database.EnsureCreated();

            if (context.Cars.Any())
            {
                return;
            }

            var cars = new Car[]
            {
                new Car{Make="Test",Model="Test",Date=new DateTime(),Nov=0,Dec=0,Jan=0}
            };
            foreach (Car item in cars)
            {
                context.Cars.Add(item);
            }

            context.SaveChanges();
        }
    }
}

