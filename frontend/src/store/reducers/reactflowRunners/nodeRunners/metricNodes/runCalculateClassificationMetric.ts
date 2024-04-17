import { ClassificationMetricCalculationRequest } from 'interfaces/dtos/classificationMetricCalculationDto.interface';
import { Node } from 'reactflow';
import { metricApi } from 'services/metricService';

export const run = async (node: Node, thunkApi: any) => {
  const classificationMetricCalculationRequest: ClassificationMetricCalculationRequest =
    {
      nlpDatasetId: node.data?.input?.nlpDataset?.id,
      predictedNlpDatasetId: node.data?.input?.predictedNlpDataset?.id,
      metricName: node.data?.input?.metricName,
      average: node.data?.input?.average,
    };
  const { data: result } = await thunkApi.dispatch(
    metricApi.endpoints.calculateClassification.initiate(
      classificationMetricCalculationRequest
    )
  );

  return {
    result: result,
  };
};
