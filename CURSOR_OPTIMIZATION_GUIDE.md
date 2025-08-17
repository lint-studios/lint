# Cursor AI Token Optimization Guide

## 🎯 Goal: Maintain Effective Collaboration While Reducing Token Usage

### 📝 Response Formatting Guidelines

#### ✅ Optimized Response Format:
```
Brief confirmation of action → Execute tools → Concise summary only
```

#### ❌ Avoid (High Token Usage):
- Long emoji-filled summaries
- Detailed step-by-step breakdowns
- Repetitive confirmations
- Extensive formatting/visual elements

### 🔧 Best Practices for Collaboration

#### 1. **Direct Communication**
- User: "Fix spacing" → AI: *fixes + brief confirm*
- Avoid: Long explanations unless requested

#### 2. **Batch Operations**
- Combine multiple small changes into one request
- Use parallel tool calls when possible

#### 3. **Focused Requests**
- Be specific about what needs changing
- Reference line numbers or specific elements

#### 4. **Minimal Confirmations**
- AI should confirm action taken, not repeat requirements
- Skip decorative formatting unless specifically asked

### 💡 Token-Efficient Workflows

#### For Code Changes:
1. User describes change needed
2. AI makes change with tools
3. AI responds: "Applied [brief description]. Ready for testing."

#### For Deployments:
1. AI commits and pushes
2. AI responds: "Deployed successfully."

#### For Multiple Changes:
1. User lists all changes needed
2. AI executes all in parallel
3. AI responds with bullet list of completed items

### 📊 High vs Low Token Usage Examples

#### High Token Usage (Avoid):
```
🎉 **Successfully Applied All Changes!**

### ✅ **What Was Fixed:**
- **Font Spacing:** Changed from -0.2rem to -0.18rem
- **Header Alignment:** Added text-center classes
- **Gradient Colors:** Implemented animated badges

### 🔧 **Technical Details:**
- Updated Dashboard.tsx with new spacing
- Modified figma.css with gradient classes
- Adjusted TopBar.tsx for consistency

### 🚀 **Deployment Status:**
- Build: ✅ Successful
- Tests: ✅ Passed
- Production: ✅ Live

Ready for testing! 🎊
```

#### Low Token Usage (Use This):
```
Applied font spacing (-0.18rem), centered headers, added gradient badges. Deployed successfully.
```

### 🔄 Remember Settings
- **Default Mode:** Concise responses unless details requested
- **Decorative Elements:** Only when specifically asked
- **Status Updates:** Brief confirmations only
- **Summaries:** Minimal unless debugging/complex changes

### 🎛️ User Commands for Control
- `brief` - Give minimal response
- `detailed` - Full explanation needed
- `status` - Just confirm what was done
- `deploy` - Execute and confirm only

---

**Note:** This guide should be referenced at the start of sessions to maintain token efficiency while preserving collaboration quality.
