import {
  Button,
  Typography,
  useTheme,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import { categories } from '@/data/Category';
import { SavingsRecordProps } from '@/app/interface';

function CategoryPanel({record, handler}: SavingsRecordProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const onSelect = (category: string) => {
    handler({ category });
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    onSelect(event.target.value);
  };

  if (isMobile) {
    return (
      <div className="mx-1 my-2 w-full">
        <FormControl fullWidth>
          <InputLabel id="category-select-label">Category</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            value={record.category || ''}
            label="Category"
            onChange={handleSelectChange}
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.id}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    );
  }

  return (
    <div>
      <Typography component="h4" className="m-1">Category</Typography>
      <div
        className="flex flex-wrap items-center justify-start gap-1"
      >
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={record.category === category.id ? "contained" : "outlined"}
            onClick={() => onSelect(category.id)}
            className="p-1 m-1 rounded-md"
            size="small"
          >
            {category.id}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default CategoryPanel;
