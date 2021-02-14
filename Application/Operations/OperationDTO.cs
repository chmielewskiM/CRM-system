using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using Domain;

namespace Application.Operations
{
    public class OperationDTO
    {
        public Guid Id { get; set; }
        public Int64 Lead { get; set; }
        public Int64 Opportunity { get; set; }
        public Int64 Quote { get; set; }
        public Int64 Invoice { get; set; }
        public Int64 Converted { get; set; }
        public Int64 Order { get; set; }
        public Double Revenue { get; set; }
        public string Source { get; set; }
        public DateTime Date { get; set; }
        [JsonProperty("user")]
        public ICollection<OperationDoneByDTO> UserOperations { get; set; }
    }
}