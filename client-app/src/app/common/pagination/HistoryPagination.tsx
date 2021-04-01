import React from 'react';
import { Icon, Pagination, Segment } from 'semantic-ui-react';
interface IProps {
  pageSize: number;
  onPageChange: (pageNumber: number) => void;
  itemsCount: number;
}

const countTotalPages = (pageSize: number, itemsCount: number) => {
  let addPage = 1;
  let floor = Math.floor(itemsCount / pageSize);
  let verifier = Math.floor(itemsCount / pageSize - 0.001);

  if (verifier < floor) addPage = 0;

  if (floor + addPage == 0) return 1;

  return floor + addPage;
};

const HistoryPagination: React.FC<IProps> = (props) => (
  <Segment attached="bottom" className="history-pagination">
    <Pagination
      boundaryRange={0}
      defaultActivePage={1}
      ellipsisItem={null}
      firstItem={{ content: <Icon name="angle double left" />, icon: true }}
      lastItem={{ content: <Icon name="angle double right" />, icon: true }}
      prevItem={{ content: <Icon name="angle left" />, icon: true }}
      nextItem={{ content: <Icon name="angle right" />, icon: true }}
      totalPages={countTotalPages(props.pageSize, props.itemsCount)}
      onPageChange={(e, d) => {
        props.onPageChange(Number(d.activePage));
      }}
    />
  </Segment>
);

export default HistoryPagination;
