import { ApiProperty } from '@nestjs/swagger';
import { OperationResult, ResultStatus } from './operation-result';

export class ServiceResponse<T = any> {
  @ApiProperty()
  error: number;

  @ApiProperty()
  data: T;

  constructor(props: ServiceResponse<T>) {
    this.error = props.error;
    this.data = props.data;
  }

  static fromResult<T>(result: OperationResult<T>): ServiceResponse {
    if (result.isError()) {
      throw result.error;
    }

    if (result.isFail()) {
      throw result.error;
    }

    return new ServiceResponse({
      data: result.data!,
      error: 0,
    });
  }

  static fromResultWithDataMapper<T, D>(
    result: OperationResult<T>,
    dataMapper: (T) => D,
  ) {
    if (result.isError()) {
      throw result.error;
    }
    if (result.isFail()) {
      throw result.error;
    }
    return new ServiceResponse({
      data: dataMapper(result.data),
      error: 0,
    });
  }

  static resultFromServiceResponse<T>(response: any, dataField: string) {
    if (response.error !== 0) {
      throw OperationResult.error(new Error(response.message));
    }
    return new OperationResult<T>(ResultStatus.OK, response[dataField]);
  }
}
