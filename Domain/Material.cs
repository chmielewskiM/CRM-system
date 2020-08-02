using System;

namespace Domain
{
    public class Material
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Storehouse { get; set; }
        public Double Available { get; set; }
        public Double Deployed { get; set; }
        public Double Ordered { get; set; }
        public Double Required { get; set; }

    }
}
