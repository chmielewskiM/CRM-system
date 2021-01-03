using AutoMapper;
using Domain;

namespace Application.Leads
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Contact, LeadDTO>();
            CreateMap<UserContact, Application.Contacts.UserAccessDTO>()
            .ForMember(d => d.Username, o => o.MapFrom(s => s.User.UserName))
            .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.User.DisplayName))
            .ForMember(d => d.Level, o => o.MapFrom(s => s.User.Level));
        }
    }
}