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

export const contentCol = (screen, lg) => {
  let flex = 'none';

  if (screen.xs) flex = '100%';
  if (screen.sm || screen.md) flex = 'auto';
  if (screen.lg) flex = lg;

  return { flex: flex };
};

export const labelCol = (screen, width) => {
  let flex = 'none';

  if (!screen.lg) flex = width;

  return { flex: flex };
};

export const pairOfFiltersHeader = (
  screen,
  fields,
  flexContent1 = 3,
  flexContent2 = 1,
  labelWidth = '153px'
) => {
  const firstPair = (
    <>
      <Col {...labelCol(screen, labelWidth)}>{fields[0]}</Col>
      <Col {...contentCol(screen, flexContent1)}>{fields[1]}</Col>
    </>
  );
  const secondPair = (
    <>
      <Col {...labelCol(screen, labelWidth)}>{fields[2]}</Col>
      <Col {...contentCol(screen, flexContent2)}>{fields[3]}</Col>
    </>
  );

  let secondRow = null;
  let restOfFirstRow = null;
  if (!screen.lg) {
    secondRow = <Row gutter={[16, 12]}>{secondPair}</Row>;
  } else restOfFirstRow = secondPair;
  const firstRow = (
    <Row gutter={[16, 12]} style={{ marginBottom: 10 }}>
      {firstPair}
      {restOfFirstRow}
    </Row>
  );

  return (
    <>
      {firstRow}
      {secondRow}
    </>
  );
};
