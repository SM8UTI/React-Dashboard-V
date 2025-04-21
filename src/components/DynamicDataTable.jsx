import React, { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TextInput,
  Select,
  Pagination,
  Group,
  Text,
  Box,
  UnstyledButton,
  Center,
  Stack,
  rem,
} from "@mantine/core";
import {
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiSearch2Line,
} from "react-icons/ri";

const DynamicDataTable = ({
  data,
  columns,
  enableSorting = true,
  enableFiltering = true,
  enablePagination = true,
  title = "Data Table",
}) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pageSize, setPageSize] = useState(10);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  const handlePageSizeChange = (value) => {
    setPageSize(Number(value));
    table.setPageSize(Number(value));
  };

  return (
    <Stack spacing="md" p="md" className="max-w-screen-xl mx-auto">
      {/* Header Section */}
      <Group justify="space-between" align="center">
        <Text size="lg" fw={600}>
          {title}
        </Text>
        {data && (
          <Text size="sm" c="dimmed">
            {data.length} items
          </Text>
        )}
      </Group>

      {/* Filters Section */}
      {enableFiltering && (
        <Group gap="md">
          <TextInput
            placeholder="Search..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.currentTarget.value)}
            leftSection={<RiSearch2Line size={16} />}
            styles={{
              input: {
                border: "1px solid #dee2e6",
              },
            }}
            w={{ base: "100%", xs: 250 }}
          />
          <Select
            data={[
              { value: "10", label: "10 rows" },
              { value: "20", label: "20 rows" },
              { value: "50", label: "50 rows" },
            ]}
            value={String(pageSize)}
            onChange={handlePageSizeChange}
            w={{ base: "100%", xs: 120 }}
            styles={{
              input: {
                border: "1px solid #dee2e6",
              },
            }}
          />
        </Group>
      )}

      {/* Table Section */}
      <Box style={{ overflowX: "auto" }}>
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Table.Th key={header.id}>
                    {header.isPlaceholder ? null : (
                      <UnstyledButton
                        onClick={header.column.getToggleSortingHandler()}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: rem(4),
                        }}
                      >
                        <Text fw={500} size="sm">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </Text>
                        {enableSorting && (
                          <Center>
                            {{
                              asc: <RiArrowUpSLine size={16} />,
                              desc: <RiArrowDownSLine size={16} />,
                            }[header.column.getIsSorted()] ?? (
                              <RiArrowDownSLine
                                size={16}
                                style={{ opacity: 0.3 }}
                              />
                            )}
                          </Center>
                        )}
                      </UnstyledButton>
                    )}
                  </Table.Th>
                ))}
              </Table.Tr>
            ))}
          </Table.Thead>
          <Table.Tbody>
            {table.getRowModel().rows.map((row) => (
              <Table.Tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Table.Td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Td>
                ))}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Box>

      {/* Pagination Section */}
      {enablePagination && data && (
        <Group justify="space-between" align="center">
          <Text size="sm" c="dimmed">
            Showing {table.getState().pagination.pageIndex * pageSize + 1} to{" "}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * pageSize,
              data.length
            )}{" "}
            of {data.length}
          </Text>
          <Pagination
            total={table.getPageCount()}
            value={table.getState().pagination.pageIndex + 1}
            onChange={(page) => table.setPageIndex(page - 1)}
            size="sm"
          />
        </Group>
      )}
    </Stack>
  );
};

export default DynamicDataTable;
