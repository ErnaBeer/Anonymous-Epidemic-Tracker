# One-Minute Video Script - Anonymous Epidemic Tracker

**Zama Bounty Program December 2025 Submission**

**Target Duration**: 60 seconds
**Required**: Demonstration video (mandatory for bounty submission)

---

## Video Flow

### Scene 1: Introduction (10 seconds)
**Screen**: Project README header with title and badges

**Narration**: See `VIDEO-DIALOGUE.md`

**Visual**:
- Show project name: "Anonymous Epidemic Tracker"
- Display badges: MIT License, Hardhat, FHEVM
- Quick pan to folder structure

---

### Scene 2: Problem & Solution (10 seconds)
**Screen**: README Overview section or simple diagram

**Narration**: See `VIDEO-DIALOGUE.md`

**Visual**:
- Split screen showing:
  - Left: Individual privacy concern (locked icon)
  - Right: Public health needs (aggregated data chart)
- Transition to FHE solution logo

---

### Scene 3: FHEVM Concepts (15 seconds)
**Screen**: README FHEVM Concepts section + code snippets

**Narration**: See `VIDEO-DIALOGUE.md`

**Visual**:
- Rapidly cycle through 5 concept icons:
  1. 🔐 User Decryption
  2. 📊 Public Decryption
  3. ➕ Encrypted Arithmetic
  4. 🔑 Access Control
  5. ✅ Input Validation
- Show brief code snippet for each (2-3 seconds each)

---

### Scene 4: Test Execution (15 seconds)
**Screen**: Terminal running `npm test`

**Narration**: See `VIDEO-DIALOGUE.md`

**Visual**:
```bash
npm test
```
- Show test output scrolling
- Highlight key results:
  - ✓ 25 passing tests
  - All chapters covered (access-control, user-decryption, etc.)
  - Zero failures
- Speed up terminal output (timelapse effect)

---

### Scene 5: Contract Highlights (5 seconds)
**Screen**: VS Code with `AnonymousEpidemicTracker.sol`

**Narration**: See `VIDEO-DIALOGUE.md`

**Visual**:
- Quick scroll through contract highlighting:
  - Line 137-138: FHE.asEuint8() encryption
  - Line 150-151: FHE.add() aggregation
  - Line 176: FHE.requestDecryption()

---

### Scene 6: Closing (5 seconds)
**Screen**: README submission checklist or final slide

**Narration**: See `VIDEO-DIALOGUE.md`

**Visual**:
- Show submission checklist with all items checked ✅
- Display: "Zama Bounty Program December 2025"
- Fade to project repository URL placeholder

---

## Production Notes

### Recording Setup
- **Resolution**: 1920x1080 (1080p)
- **Frame Rate**: 30 fps
- **Screen Recording**: OBS Studio or similar
- **Audio**: Clear voiceover, no background music (keeps focus)

### Visual Style
- **Terminal Font**: Increase to 18pt for readability
- **Code Editor**: Use high-contrast theme (Dark+ or similar)
- **Transitions**: Quick fades (0.3s) between scenes
- **Pace**: Fast-paced but clear (information dense)

### Pre-Recording Checklist
- [ ] Terminal font size increased
- [ ] Code editor theme set to high contrast
- [ ] All tests passing
- [ ] Browser tabs closed (clean desktop)
- [ ] Voiceover script rehearsed
- [ ] Screen resolution set to 1920x1080

### Recording Commands

Prepare these in separate terminal tabs:

```bash
# Tab 1: Quick tests
npm test

# Tab 2: Contract code
# (Have AnonymousEpidemicTracker.sol open in VS Code)

# Tab 3: README
# (Have README.md open in browser or markdown preview)
```

### Timing Breakdown

| Scene | Duration | Content |
|-------|----------|---------|
| 1 | 0:00-0:10 | Introduction |
| 2 | 0:10-0:20 | Problem & Solution |
| 3 | 0:20-0:35 | FHEVM Concepts |
| 4 | 0:35-0:50 | Test Execution |
| 5 | 0:50-0:55 | Contract Highlights |
| 6 | 0:55-1:00 | Closing |
| **Total** | **1:00** | **Complete** |

---

## Post-Production

### Editing Steps
1. Import all screen recordings
2. Cut and arrange according to timing breakdown
3. Add voiceover from `VIDEO-DIALOGUE.md`
4. Sync audio with visuals
5. Add quick fade transitions (0.3s)
6. Optional: Add subtle text overlays for key concepts
7. Export at 1080p, H.264 codec

### Quality Checks
- [ ] Video is exactly 60 seconds (±3 seconds acceptable)
- [ ] Audio is clear and audible
- [ ] All text on screen is readable
- [ ] Terminal output is legible
- [ ] Code snippets are visible
- [ ] Pacing feels appropriate (not rushed, not slow)
- [ ] All 5 FHEVM concepts are shown
- [ ] Test results are clearly visible

### Export Settings
- **Resolution**: 1920x1080
- **Codec**: H.264
- **Bitrate**: 10-15 Mbps (high quality)
- **Audio**: AAC, 192 kbps
- **Container**: MP4

---

## Alternative Approach: Silent Screenshare + Captions

If voiceover is challenging, consider:

1. Record pure screenshare (no audio)
2. Add text captions for each scene
3. Use on-screen annotations to highlight key areas
4. Add background music (subtle, non-distracting)

**Caption Examples**:
- Scene 1: "Anonymous Epidemic Tracker - Privacy-Preserving Health Monitoring"
- Scene 2: "Problem: Privacy vs. Public Health Data Needs"
- Scene 3: "Solution: 5 Core FHEVM Patterns Implemented"
- Scene 4: "25+ Comprehensive Tests - All Passing ✓"
- Scene 5: "Full FHE Encryption: euint8, FHE.add(), Public Decryption"
- Scene 6: "Zama Bounty December 2025 Submission"

---

## Upload & Submission

### Video Hosting Options
1. **YouTube** (recommended - easy sharing, good quality)
   - Upload as unlisted or public
   - Title: "Anonymous Epidemic Tracker - FHEVM Privacy Health Monitoring (Zama Bounty 2025)"
   - Description: Include repository link and key features

2. **Vimeo** (professional, high quality)
   - Similar approach to YouTube

3. **Google Drive** (direct file sharing)
   - Set sharing to "Anyone with the link"

### Video Link
Once uploaded, add the link to:
- README.md (add a "Demo Video" section)
- Bounty submission form
- Project description

---

## Tips for Success

### Do's ✅
- Keep pace fast but clear
- Show real test execution (not mocked)
- Highlight actual code (not screenshots)
- Demonstrate the value proposition clearly
- Stay under 60 seconds (judges are busy)

### Don'ts ❌
- Don't add unnecessary animations
- Don't use distracting background music
- Don't show your face (focus on code/demo)
- Don't include unrelated content
- Don't rush the narration (speak clearly)

---

## Backup Plan: Extended 2-Minute Version

If you want to create a more detailed version later:

**Additional Scenes** (60 seconds more):
- Deployment demonstration (20s)
- Frontend interaction (20s)
- Real-world use cases (10s)
- Extended closing with contact info (10s)

This can serve as a supplementary "deep dive" video, but the 1-minute version is your primary submission video.

---

**Ready to Record?**

1. Review `VIDEO-DIALOGUE.md` for exact narration
2. Run through the flow once as practice
3. Record each scene separately
4. Edit together in post-production
5. Review for quality
6. Export and upload
7. Submit link with bounty application

**Good luck with your video demonstration!**
