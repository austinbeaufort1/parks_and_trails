import '../../App.css';
import React from 'react';
import { Table, Tag, Columns } from 'antd';
import { ColumnType } from 'antd/es/table';
import { AngleDesc, DifficultyDesc, Row, tableColors } from './tableTypes';
import { data } from './tableData';
import { getAngleTag, getDifficultyTag } from './getTagColor';


const columns: ColumnType<Row>[] = [
  {
    title: 'State',
    dataIndex: 'state',
    key: 'state',
    render: (text: string) => ({
      props: {
        style: { background: tableColors.lightGreen }
      },
      children: <div>{text}</div>
    })
  },
  {
    width: '100px',
    title: 'County',
    dataIndex: 'county',
    key: 'county',
    render: (text: string) => ({
      props: {
        style: { background: tableColors.lightestGreen }
      },
      children: <div>{text}</div>
    })
  },
  {
    width: '100px',
    title: 'Park Name',
    dataIndex: 'parkName',
    key: 'parkName',
    render: (text: string) => ({
      props: {
        style: { background: tableColors.lightGreen }
      },
      children: <div>{text}</div>
    })
  },
  {
    width: '100px',
    title: 'Trail Name',
    dataIndex: 'trailName',
    key: 'trailName',
    render: (text: string) => ({
      props: {
        style: { background: tableColors.lightestGreen }
      },
      children: <div>{text}</div>
    })
  },
  {
    title: 'Explore!',
    dataIndex: 'videos',
    key: 'videos',
    width: '100px',
    render: (videos: string[][]) => ({
      props: {
        style: { background: tableColors.lightBlue },
      },
      children: <div>
        {videos.map((video: string[], i: number) =>
          (<p key={i}><a target='_blank' href={video[1]}>{video[0]}</a></p>))
        }
      </div>
    }),
  },
  {
    title: 'Dist\nance\n (mi)',
    dataIndex: 'distance',
    key: 'distance',
    width: '50px',
    defaultSortOrder: 'descend',
    sorter: (a: { distance: number }, b: { distance: number }) => a.distance - b.distance,
    render: (text: string) => ({
      props: {
        style: { background: tableColors.lightBrown }
      },
      children: <div>{text}</div>
    })
  },
  {
    title: 'Elev\nation\n Gain\n (ft)',
    dataIndex: 'elevationGain',
    key: 'elevationGain',
    width: '50px',
    defaultSortOrder: 'descend',
    sorter: (a: { elevationGain: number }, b: { elevationGain: number }) => a.elevationGain - b.elevationGain,
    render: (text: string) => ({
      props: {
        style: { background: tableColors.lightestBrown }
      },
      children: <div>{text}</div>
    })
  },
  {
    title: 'Dif\nicu\nlty',
    dataIndex: 'difficulty',
    key: 'difficulty',
    width: '50px',
    defaultSortOrder: 'descend',
    sorter: (a: { difficulty: number }, b: { difficulty: number }) => a.difficulty - b.difficulty,
    render: (text: string) => ({
      props: {
        style: { background: tableColors.lightBrown }
      },
      children: <div>{text}</div>
    })
  },
  {
    title: 'Difficulty',
    dataIndex: 'difficultyDesc',
    key: 'difficultyDesc',
    width: '50px',
    render: (text: DifficultyDesc) => ({
      props: {
        style: { background: tableColors.lightestBrown }
      },
      // @ts-expect-error Tag takes children but typescript is erroring
      children: <div><Tag color={getDifficultyTag(text)}>{text}</Tag></div>
    })
  },
  {
    title: 'Avg Angle (deg)',
    dataIndex: 'angle',
    key: 'angle',
    width: '50px',
    defaultSortOrder: 'descend',
    sorter: (a: { angle: number }, b: { angle: number }) => a.angle - b.angle,
    render: (text: string) => ({
      props: {
        style: { background: tableColors.lightBrown }
      },
      children: <div>{text}</div>
    })
  },
  {
    title: 'Avg Angle',
    dataIndex: 'angleDesc',
    key: 'angleDesc',
    width: '50px',
    render: (text: AngleDesc) => ({
      props: {
        style: { background: tableColors.lightestBrown }
      },
      // @ts-expect-error Tag takes children but typescript is erroring
      children: <div><Tag color={getAngleTag(text)}>{text}</Tag></div>
    })
  },
  {
    title: 'Route',
    dataIndex: 'route',
    key: 'route',
    render: (text: string) => ({
      props: {
        style: { background: tableColors.lightBrown }
      },
      children: <div>{text}</div>
    })
  },
];


const MainTable: React.FC = () => <Table
  columns={columns as Columns}
  dataSource={data}
  // @ts-expect-error expandable type error with Table
  expandable={{
    expandedRowRender: (record: Row) => {
      const crux = record.extras.crux;
      return (
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0 }}><strong>Description: </strong>{record.extras.description}</p>
          {crux.distance === 0
            ? (
              <>
                <p><strong>Most Difficult Part (Crux) of the Trail:</strong> </p>
                <p>No crux</p>
              </>
            )
            : (
              <>
                <p><strong>Most Difficult Part (Crux) of the Trail:</strong> </p>
                {/* @ts-expect-error Tag takes children but typescript is erroring */} 
                <Tag color={getAngleTag(crux.angleDesc)}>{crux.angleDesc}</Tag>
                <p>Crux Distance: {crux.distance} miles</p>
                <p>Crux Angle: {crux.angle} degrees</p>
              </>
            )
          }
        </div>
      )
    }
  }}
/>;

// typescript not picking up on data or columns being used, so logging it here
console.log(data)
console.log(columns)

export default MainTable;
