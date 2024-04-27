using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Technosec_Test.Data;

namespace Technosec_Test.Controllers
{
    [Route("api/[controller]")]
    public class CarsController : Controller
    {
        private readonly Context _context;
        public CarsController(Context context)
        {
            _context = context;
        }

        [HttpGet]
        public JsonResult Get()
        {
            return Json(_context.Cars.ToList()); ;
        }
        [HttpPost("Create")]
        public JsonResult Create([FromHeader] string json)
        {
            Car obj = JsonConvert.DeserializeObject<Car>(json);
            Car newOne = new Car();
            newOne.Make = obj.Make;
            newOne.Model = obj.Model;
            newOne.Nov = obj.Nov;
            newOne.Dec = obj.Dec;
            newOne.Jan = obj.Jan;
            newOne.Date = obj.Date;
            _context.Cars.Add(newOne);
            _context.SaveChanges();
            return Json(_context.Cars.ToList());
        }
        [HttpPut("Update")]
        public JsonResult Update([FromHeader] string json)
        {
            Car obj = JsonConvert.DeserializeObject<Car>(json);
            _context.Entry(obj).State = EntityState.Modified;
            _context.SaveChanges();
            return Json(_context.Cars.ToList());
        }
        [HttpDelete("Delete")]
        public JsonResult Delete(int id)
        {
            Car car = _context.Cars.FirstOrDefault(x => x.ID == id);
            _context.Cars.Remove(car);
            _context.SaveChanges();
            return Json(_context.Cars.ToList());
        }
    }
}

