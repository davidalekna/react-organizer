import React from 'react';
import styled from 'styled-components';
import { useCalendarTools } from '../../hooks/use-calendar-tools';

const StyledGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: 1fr;
  outline: 1px dashed red;
`;

const GridItem = styled.div`
  display: flex;
  flex: 0 0 auto;
  outline: 1px dashed orange;
`;

export const Calendar = () => {
  const { days, now, monthsNames, daysNames, ...tools } = useCalendarTools();

  return (
    <div>
      <div>{monthsNames[now.getMonth()]}</div>
      <StyledGrid>
        {daysNames.map((dayName) => (
          <GridItem>{dayName}</GridItem>
        ))}
        {Object.values(days).map((day, index) => (
          <GridItem key={index}>
            {day.day} - {day.name}
          </GridItem>
        ))}
      </StyledGrid>
    </div>
  );
};
