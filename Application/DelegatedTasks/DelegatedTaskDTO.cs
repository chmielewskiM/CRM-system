using System;
using System.Collections.Generic;
using Domain;
using Newtonsoft.Json;

namespace Application.DelegatedTasks
{
    public class DelegatedTaskDTO
    {
        public Guid Id { get; set; }
        public string Type { get; set; }
        public DateTime DateStarted { get; set; }
        public DateTime Deadline { get; set; }
        public string Notes { get; set; }
        public string CreatedBy { get; set; }
        public Boolean Done { get; set; }
        public Boolean Accepted {get; set; }
        public Boolean Refused { get; set; }
        
        [JsonProperty("users")]
        public virtual ICollection<UserTask> UserTasks { get; set; }
    }
}