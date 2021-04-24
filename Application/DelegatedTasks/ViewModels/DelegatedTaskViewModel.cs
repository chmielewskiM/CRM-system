using System;
using System.Collections.Generic;
using Domain;
using Newtonsoft.Json;

namespace Application.DelegatedTasks
{
    public class DelegatedTaskViewModel
    {
        public Guid Id { get; set; }
        public string Type { get; set; }
        public DateTime DateStarted { get; set; }
        public DateTime Deadline { get; set; }
        public string Notes { get; set; }
        public string FinishedBy { get; set; }
        public Boolean Accepted {get; set; }
        public Boolean Refused { get; set; }
        public Boolean Pending { get; set; }
        public Boolean Done { get; set; }
        [JsonProperty("access")]
        public UserAccessViewModel UserTask { get; set; }
    }
}