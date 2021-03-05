import React from 'react';
import { Icon, Pagination, Segment } from 'semantic-ui-react';
interface IProps{
  totalPages:number;
  pageSize:number;
  onPageChange: (pageSize:number, pageNumber:number)=>void;
}
const HistoryPagination:React.FC<IProps> = (props) => (
  <Segment attached='bottom' className='history-pagination'>
  <Pagination
    boundaryRange={0}
    defaultActivePage={1}
    ellipsisItem={null}
    firstItem={{ content: <Icon name="angle double left" />, icon: true }}
    lastItem={{ content: <Icon name="angle double right" />, icon: true }}
    prevItem={{ content: <Icon name="angle left" />, icon: true }}
    nextItem={{ content: <Icon name="angle right" />, icon: true }}
    totalPages={props.totalPages}
    onPageChange={(e, d)=>props.onPageChange(props.pageSize, Number(d.activePage))}
  />
  </Segment>
);

export default HistoryPagination;
