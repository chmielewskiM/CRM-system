using AutoMapper;
using Domain;

namespace Application.Orders
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Order, OrderDTO>()
            .ForMember(d => d.ClientName, o => o.MapFrom(s => s.Client.Name));
        }
    }
}