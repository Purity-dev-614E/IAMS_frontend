# Frontend Models Documentation

This directory contains standardized data models that map database columns to frontend field names, ensuring consistency across the application.

## Architecture Overview

### Base Model (`BaseModel.js`)
- Provides common functionality for all models
- Handles field mapping between database (snake_case) and frontend (camelCase)
- Includes validation, sanitization, and transformation methods

### Model Classes
Each database table has a corresponding model class:
- `User.js` - Users table
- `Student.js` - Students table  
- `Attachment.js` - Attachments table
- `DailyLog.js` - Daily logs table
- `WeeklyReview.js` - Weekly reviews table
- `IndustryFeedback.js` - Industry feedback table
- `UniFeedback.js` - University feedback table
- `Report.js` - Reports table
- `RefreshToken.js` - Refresh tokens table

### Model Transformer (`ModelTransformer.js`)
Utility class for transforming between API responses and model instances:
- `transformToModel()` - Convert API data to model instances
- `transformToAPI()` - Convert models to API request format
- `transformPaginated()` - Handle paginated responses
- `validateModel()` - Validate model data
- `transformError()` - Standardize error handling

## Usage Examples

### Creating a Model Instance
```javascript
import { DailyLog } from '../models';

// From API response
const apiData = {
  id: 1,
  attachment_id: 123,
  tasks_performed: "Worked on React components",
  skills_acquired: "React, JavaScript",
  log_date: "2023-04-01"
};

const dailyLog = DailyLog.fromDatabase(apiData, DailyLog);
// OR
const dailyLog = new DailyLog({
  logId: 1,
  attachmentId: 123,
  tasksPerformed: "Worked on React components",
  skillsAcquired: "React, JavaScript",
  logDate: "2023-04-01"
});
```

### Using Models in Services
```javascript
import { DailyLog, transformToModel, transformToAPI, validateModel } from '../models';

class DailyLogService {
  async createLog(logData) {
    const dailyLog = new DailyLog(logData);
    
    // Validate
    const validation = validateModel(dailyLog);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }
    
    // Transform to API format
    const apiData = transformToAPI(dailyLog);
    const response = await apiClient.post('/daily-logs', apiData);
    
    // Transform response back to model
    return transformToModel(response, DailyLog);
  }
}
```

### Using Models in Components
```javascript
import { DailyLog } from '../models';

const DailyLogComponent = ({ logData }) => {
  const dailyLog = new DailyLog(logData);
  
  return (
    <div>
      <h3>{dailyLog.getFormattedDate()}</h3>
      <p>Status: {dailyLog.getStatusDisplay()}</p>
      <p>Can edit: {dailyLog.canEdit() ? 'Yes' : 'No'}</p>
      <div>
        <strong>Tasks:</strong> {dailyLog.tasksPerformed}
      </div>
      <div>
        <strong>Skills:</strong> {dailyLog.skillsAcquired}
      </div>
    </div>
  );
};
```

## Field Mapping Convention

### Database to Frontend Mapping
- Database columns use `snake_case` (e.g., `tasks_performed`)
- Frontend fields use `camelCase` (e.g., `tasksPerformed`)
- Foreign keys use target table's primary key name (e.g., `userId`, `attachmentId`)

### Timestamp Fields
- `created_at` → `createdAt`
- `updated_at` → `updatedAt`
- Specific timestamps keep descriptive names (e.g., `submitted_at` → `submittedAt`)

### ID Fields
- Primary keys use descriptive names (e.g., `logId`, `attachmentId`)
- Foreign keys use target table's ID name (e.g., `userId`, `studentId`)

## Benefits

1. **Consistency**: All components use the same field names
2. **Type Safety**: Models define expected data types and structure
3. **Validation**: Built-in validation ensures data integrity
4. **Transformation**: Automatic mapping between database and frontend formats
5. **Maintainability**: Changes to field mappings only need to be updated in one place
6. **Backward Compatibility**: Legacy methods are preserved during migration

## Migration Guide

### For Existing Code
1. Import the relevant model class
2. Replace manual field mapping with model methods
3. Use `transformToModel()` for API responses
4. Use `transformToAPI()` for API requests
5. Replace validation logic with `validateModel()`

### Example Migration
**Before:**
```javascript
// Manual mapping
const mapped = {
  tasks_performed: formData.tasksPerformed,
  skills_acquired: formData.skillsAcquired,
  log_date: formData.logDate
};
```

**After:**
```javascript
// Using models
const dailyLog = new DailyLog(formData);
const apiData = transformToAPI(dailyLog);
```

## Best Practices

1. **Always use models** for new code instead of manual field mapping
2. **Validate models** before sending API requests
3. **Use model helper methods** for display logic (status, dates, etc.)
4. **Keep models focused** on data transformation, not business logic
5. **Document new fields** in the model's field mapping
6. **Test transformations** to ensure data integrity

## Error Handling

Models provide standardized error handling through the `ModelTransformer`:
- API errors are automatically transformed to consistent format
- Validation errors are collected and returned as arrays
- Network errors are handled gracefully

## Performance Considerations

- Model instantiation is lightweight
- Field mapping uses efficient object operations
- Validation only runs when explicitly called
- Transformations are optimized for common use cases
