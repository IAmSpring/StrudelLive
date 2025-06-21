# OpenAI Assistant Setup Guide for StrudelLive

This guide helps you configure your OpenAI Assistant to work optimally with the StrudelLive platform.

## Assistant Configuration

### Basic Settings
- **Name**: StrudelLive AI Assistant
- **Model**: gpt-4o (latest)
- **Response Format**: json_object
- **Temperature**: 1.0 (for creative musical responses)
- **Top P**: 1.0

### System Instructions
Copy the content from `openai-assistant-system-prompt.md` into your assistant's system instructions field.

### Function Definitions
Import the functions from `openai-assistant-functions.json` into your assistant's function definitions.

## File Upload Instructions

### Vector Store Setup
1. Create a new vector store in your OpenAI dashboard
2. Upload the complete Strudel documentation (provided as attached files)
3. Enable file search for the assistant
4. Link the vector store to your assistant

### Required Documentation Files
Upload these documentation files to the vector store:
- Strudel Workshop documentation
- Strudel syntax reference
- Pattern function documentation
- Audio effects documentation
- Mini-notation guide
- Sample library documentation

## Testing Your Assistant

### Basic Function Test
Test with this prompt:
```
Help me create a simple techno beat and play it
```

Expected behavior:
1. Assistant should generate appropriate Strudel code
2. Call `evaluate_strudel_code` function
3. Call `start_audio_playback` function
4. Provide helpful explanation

### Advanced Test
Test with this prompt:
```
Create an ambient pad pattern, save it as a snapshot, and then add a subtle rhythmic element
```

Expected behavior:
1. Generate ambient pattern code
2. Call `evaluate_strudel_code`
3. Call `save_project_snapshot`
4. Generate additional rhythmic code
5. Explain the creative process

## Function Implementation Notes

### Required API Endpoints
Your Strudel platform should implement these endpoints to support the functions:

- `POST /api/evaluate` - Evaluate Strudel code
- `POST /api/audio/start` - Start playback
- `POST /api/audio/stop` - Stop playback
- `POST /api/projects` - Create projects
- `PUT /api/projects/:id` - Update projects
- `POST /api/projects/:id/snapshots` - Save snapshots
- `POST /api/generate/pattern` - Generate patterns
- `POST /api/samples/play` - Play samples

### Browser Integration
The assistant's function calls should trigger browser actions through:
- WebSocket messages for real-time updates
- REST API calls for data operations
- Direct browser API access for audio control

## Response Format Guidelines

### JSON Response Structure
When using json_object response format, the assistant should return:

```json
{
  "response": "Helpful explanation text",
  "code_suggestion": "s(\"bd*4, hh*8\")",
  "function_calls": [
    {
      "function": "evaluate_strudel_code",
      "parameters": {
        "code": "s(\"bd*4, hh*8\")"
      }
    }
  ],
  "tips": "Optional performance tips or variations"
}
```

### Error Handling
Configure the assistant to handle errors gracefully:
- Provide fallback suggestions when functions fail
- Offer alternative approaches for syntax errors
- Include debugging tips for common issues

## Performance Optimization

### Function Call Strategy
- Use `evaluate_strudel_code` for immediate audio feedback
- Use `play_sample` for quick tests and demonstrations
- Batch related operations when possible
- Prioritize user experience and live performance flow

### Response Timing
- Keep function calls responsive (< 2 seconds)
- Provide immediate text responses while functions execute
- Use streaming responses for longer explanations

## Monitoring and Analytics

### Usage Tracking
Monitor these metrics:
- Function call success rates
- Response times
- User satisfaction with generated patterns
- Common error patterns

### Continuous Improvement
- Update system instructions based on user feedback
- Refine function parameters for better results
- Add new functions as platform features expand
- Update documentation in vector store regularly

## Troubleshooting

### Common Issues
1. **Functions not executing**: Check API endpoint implementation
2. **Poor pattern quality**: Adjust temperature and prompt engineering
3. **Slow responses**: Optimize function call batching
4. **Syntax errors**: Update system instructions with latest Strudel syntax

### Debug Mode
Enable verbose logging to track:
- Function call parameters and responses
- API endpoint response times
- Pattern evaluation success/failure
- User interaction patterns

## Security Considerations

### API Key Management
- Use environment variables for API keys
- Implement rate limiting on endpoints
- Validate all function parameters
- Sanitize user input before code evaluation

### Content Filtering
- Monitor generated patterns for inappropriate content
- Implement usage quotas for expensive operations
- Log function calls for audit purposes

This setup will give your OpenAI Assistant comprehensive control over the StrudelLive platform while maintaining security and performance standards.