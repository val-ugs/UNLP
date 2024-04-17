import { SummarizationMetricCalculationRequest } from 'interfaces/dtos/summarizationMetricCalculationDto.interface';
import { Node } from 'reactflow';
import { metricApi } from 'services/metricService';

export const run = async (node: Node, thunkApi: any) => {
  const summarizationMetricCalculationRequest: SummarizationMetricCalculationRequest =
    {
      nlpDatasetId: node.data?.input?.nlpDataset?.id,
      predictedNlpDatasetId: node.data?.input?.predictedNlpDataset?.id,
      metricName: node.data?.input?.metricName,
    };
  const { data: result } = await thunkApi.dispatch(
    metricApi.endpoints.calculateSummarization.initiate(
      summarizationMetricCalculationRequest
    )
  );

  return {
    result: result,
  };
};
