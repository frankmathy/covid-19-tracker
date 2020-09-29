import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';
import './InfoBox.css';
import { prettyPrintStat } from './util';

function InfoBox({ active, isRed, title, cases, total, ...props }) {
  return (
    <Card
      onClick={props.onClick}
      className={`infoBox ${active && 'infoBox--selected'} ${isRed &&
        'infoBox--red'}`}
    >
      <CardContent>
        <Typography className="infoBox__title" color="textSecondary">
          {title}
        </Typography>
        <h2 className="infoBox__cases">{'+' + prettyPrintStat(cases)}</h2>
        <Typography className="infoBox__total" color="textSecondary">
          {prettyPrintStat(total)} Total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
