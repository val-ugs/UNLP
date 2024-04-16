import React, { FC, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import ContentModal from 'components/interstitial/ContentModal';
import { MetricProps } from 'interfaces/metric.interface';
import { metricModalSlice } from 'store/reducers/metricModalSlice';
import { listOfMetrics } from 'data/listOfMetrics';
import './styles.scss';

const MetricModal: FC = () => {
  const [metric, setMetric] = useState<MetricProps>();
  const { isActive, modelType } = useAppSelector(
    (state) => state.metricModalReducer
  );
  const { deactivate } = metricModalSlice.actions;
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(deactivate());
  };

  useEffect(() => {
    setMetric(listOfMetrics.find((a) => a.modelType == modelType));
  }, [modelType]);

  return (
    <>
      {metric && (
        <ContentModal
          className="metric-modal"
          title={metric.modelType}
          isActive={isActive}
          handleClose={handleClose}
        >
          {metric.component}
        </ContentModal>
      )}
    </>
  );
};

export default MetricModal;
