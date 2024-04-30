import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { SelectQueryBuilder } from 'typeorm';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class ListFilter {
  @Transform(({ value }) => Math.max(Number(value), 1))
  @IsNumber()
  @IsOptional()
  public page = 1;

  @Transform(({ value }) => Math.max(Number(value), 1))
  @IsNumber()
  @IsOptional()
  public pageSize = 10;

  @IsOptional()
  public orderBy?: string;

  @IsEnum(SortOrder)
  @IsOptional()
  public sortOrder?: SortOrder = SortOrder.DESC;
}

export interface PagedResult<T> {
  page: {
    totalItems: number;
    totalPages: number;
    pageSize: number;
    pageNumber: number;
  };
  data: T[];
}

function pageNumberToOffset(filter: ListFilter): number {
  return (filter.page - 1) * filter.pageSize;
}

export class PageableUtils {
  public static producePagedQueryBuilder<ENTITY>(
    filter: ListFilter,
    qb: SelectQueryBuilder<ENTITY>,
  ): SelectQueryBuilder<ENTITY> {
    const queryBuilder = qb
      .take(filter.pageSize)
      .offset(pageNumberToOffset(filter));

    if (filter.orderBy) {
      queryBuilder.addOrderBy(filter.orderBy, filter.sortOrder);
    }

    return queryBuilder;
  }

  public static producePagedResult<T>(
    filter: ListFilter,
    [data, count]: [T[], number],
  ): PagedResult<T> {
    return {
      page: {
        totalItems: count,
        totalPages: Math.ceil(count / filter.pageSize),
        pageSize: filter.pageSize,
        pageNumber: filter.page,
      },
      data: data,
    };
  }
}
