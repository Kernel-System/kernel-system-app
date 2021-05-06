import { Row, Col } from 'antd';

export const itemsToGrid = (array, nRows, nCols, horizGutter) => {
  const grid = [];
  let index = 0;
  let rowIdx = 0;

  while (rowIdx < nRows || nRows === 'auto') {
    if (index >= array.length) break;

    let colIdx = 0;
    const cols = [];

    while (colIdx < nCols) {
      const element = array[index];
      cols.push(
        <Col xs={24} lg={12} key={colIdx}>
          {element}
        </Col>
      );

      colIdx++;
      index++;
    }

    const row = (
      <Row gutter={horizGutter} key={rowIdx}>
        {cols}
      </Row>
    );
    grid.push(row);
    rowIdx++;
  }
  return grid;
};
