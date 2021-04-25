using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace Application.Operations.ViewModels
{
    public class OperationViewModel
    {
        public Guid Id { get; set; }
        public bool Lead { get; set; }
        public bool Opportunity { get; set; }
        public bool Quote { get; set; }
        public bool Invoice { get; set; }
        public bool Converted { get; set; }
        public bool Order { get; set; }
        public Double Revenue { get; set; }
        public string Source { get; set; }
        public DateTime Date { get; set; }
        [JsonProperty("user")]
        public ICollection<OperationDoneByViewModel> UserOperations { get; set; }
    }
}