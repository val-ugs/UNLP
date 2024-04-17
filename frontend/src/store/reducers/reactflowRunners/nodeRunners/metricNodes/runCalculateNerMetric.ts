import { NerMetricCalculationRequest } from 'interfaces/dtos/nerMetricCalculationDto.interface';
import { Node } from 'reactflow';
import { metricApi } from 'services/metricService';

export const run = async (node: Node, thunkApi: any) => {
  const nerMetricCalculationRequest: NerMetricCalculationRequest = {
    nlpDatasetId: node.data?.input?.nlpDataset?.id,
    predictedNlpDatasetId: node.data?.input?.predictedNlpDataset?.id,
    metricName: node.data?.input?.metricName,
  };
  const { data: result } = await thunkApi.dispatch(
    metricApi.endpoints.calculateNer.initiate(nerMetricCalculationRequest)
  );

  return {
    result: result,
  };
};
