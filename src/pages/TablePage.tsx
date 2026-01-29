import { Layout } from 'antd';
import MainTable from '../components/Table/Table';

const { Content } = Layout;

const TablePage = (props) => {
  return (
    <Content style={{ width: '100%' }}>
      <MainTable {...props} style={{ width: '100%' }} />
    </Content>
  );
};

export default TablePage;
