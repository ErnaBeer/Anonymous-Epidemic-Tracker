# Video Narration - Anonymous Epidemic Tracker

**Zama Bounty Program December 2025 Submission**

This document contains the complete voiceover narration for the one-minute demonstration video. Read this script clearly and at a moderate pace during video recording.

---

## Complete Narration Script

Welcome to Anonymous Epidemic Tracker, a privacy-preserving health monitoring system built with Zama's Fully Homomorphic Encryption for the December 2025 Bounty Program.

During epidemics, health authorities need aggregated data to make informed decisions, but traditional systems compromise individual privacy. Our solution uses FHEVM to enable anonymous health reporting where individuals submit encrypted symptom scores and exposure levels, while authorities analyze only aggregated trends.

This project demonstrates five core FHEVM concepts: user decryption for individual data access, public decryption for aggregate analysis, encrypted arithmetic using FHE add operations, granular access control with FHE allow, and comprehensive input validation.

The comprehensive test suite includes twenty-five passing tests organized by FHEVM concept chapters, covering access control, user decryption, public decryption, encrypted arithmetic, and input validation patterns.

The smart contract implements encrypted health data structures using euint8 and euint16 types, with functions for period management, anonymous report submission, and decryption-based analysis.

This complete implementation demonstrates how FHEVM enables privacy-preserving applications in healthcare. Thank you for watching this Zama Bounty Program submission.

---

## Alternative Narration (Slightly Slower Pace)

If the above feels rushed, use this slightly expanded version with more breathing room:

---

Hello, I'm presenting Anonymous Epidemic Tracker, a privacy-preserving health monitoring system built using Zama's Fully Homomorphic Encryption Virtual Machine. This project was created for the Zama Bounty Program December 2025.

The problem is clear: during epidemic outbreaks, health authorities need aggregated population data, but individuals are rightfully concerned about privacy. Traditional systems expose sensitive individual health information.

Our solution leverages FHEVM to allow individuals to submit encrypted symptom scores and exposure levels. Health authorities can analyze aggregated encrypted totals without ever accessing individual data, preserving privacy while enabling public health insights.

This project demonstrates five essential FHEVM patterns. First, user decryption where reporters retain access to their own encrypted data. Second, public decryption for aggregate statistics only. Third, encrypted arithmetic to sum values without decryption. Fourth, access control using FHE allow primitives. And fifth, input validation for encrypted data.

The project includes twenty-five comprehensive tests, all passing, organized by FHEVM concept chapters to serve as learning examples for developers.

The smart contract uses encrypted types like euint8 for individual scores and euint16 for aggregated sums, implementing the full lifecycle from encrypted data submission to decrypted analysis.

Thank you for watching this demonstration of how Fully Homomorphic Encryption enables privacy-preserving healthcare applications. This has been a Zama Bounty Program December 2025 submission.

---

## Narration Tips for Recording

### Pacing Guidelines
- **Normal speaking pace**: 140-160 words per minute
- **Script 1 word count**: ~145 words (58-62 seconds)
- **Script 2 word count**: ~180 words (68-77 seconds)
- Choose the script that fits your natural speaking rhythm

### Delivery Style
- **Tone**: Professional but approachable
- **Energy**: Enthusiastic but not over-the-top
- **Clarity**: Enunciate technical terms clearly
- **Pauses**: Brief pause after each major concept

### Technical Terms to Emphasize
Pronounce these clearly and with slight emphasis:
- **FHEVM** (F-H-E-V-M, not "fev-um")
- **euint8** (E-U-int-eight)
- **euint16** (E-U-int-sixteen)
- **Zama** (ZAH-mah)

### Recording Best Practices
1. **Warm up your voice** before recording
2. **Stand while recording** for better breath control
3. **Use a pop filter** if available
4. **Record in a quiet room** (close windows, turn off fans)
5. **Keep phone on silent**
6. **Do 2-3 takes** and choose the best
7. **Don't worry about minor stumbles** - can be edited

### Microphone Distance
- **USB/Condenser mic**: 6-8 inches away
- **Built-in laptop mic**: 12-15 inches away
- **Headset mic**: Standard position
- **Phone mic**: 6-8 inches in landscape mode

### Audio Editing Tips
If editing your own audio:
- Remove background noise (use Audacity's Noise Reduction)
- Normalize volume to -3dB to -6dB
- Apply gentle compression for consistent volume
- Add slight EQ boost at 3-5kHz for clarity
- Export as WAV or high-quality MP3 (320kbps)

---

## Quick Reference: Scene-by-Scene Narration

If you prefer to record in segments and edit together:

### Scene 1: Introduction
"Welcome to Anonymous Epidemic Tracker, a privacy-preserving health monitoring system built with Zama's Fully Homomorphic Encryption for the December 2025 Bounty Program."

### Scene 2: Problem & Solution
"During epidemics, health authorities need aggregated data to make informed decisions, but traditional systems compromise individual privacy. Our solution uses FHEVM to enable anonymous health reporting where individuals submit encrypted symptom scores and exposure levels, while authorities analyze only aggregated trends."

### Scene 3: FHEVM Concepts
"This project demonstrates five core FHEVM concepts: user decryption for individual data access, public decryption for aggregate analysis, encrypted arithmetic using FHE add operations, granular access control with FHE allow, and comprehensive input validation."

### Scene 4: Testing
"The comprehensive test suite includes twenty-five passing tests organized by FHEVM concept chapters, covering access control, user decryption, public decryption, encrypted arithmetic, and input validation patterns."

### Scene 5: Contract Highlights
"The smart contract implements encrypted health data structures using euint8 and euint16 types, with functions for period management, anonymous report submission, and decryption-based analysis."

### Scene 6: Closing
"This complete implementation demonstrates how FHEVM enables privacy-preserving applications in healthcare. Thank you for watching this Zama Bounty Program submission."

---

## Phonetic Guide for Technical Terms

To ensure correct pronunciation:

- **FHEVM**: Eff-Aitch-Ee-Vee-Em (spell it out)
- **euint8**: Ee-You-Int-Eight (encrypted unsigned integer 8-bit)
- **euint16**: Ee-You-Int-Sixteen (encrypted unsigned integer 16-bit)
- **Zama**: ZAH-mah (emphasis on first syllable)
- **Sepolia**: Seh-POH-lee-ah (Ethereum testnet)
- **Hardhat**: HARD-hat (development framework)
- **Solidity**: Soh-LID-ih-tee (programming language)

---

## Alternative Opening Lines

Choose the one that feels most natural:

**Option 1** (Current):
"Welcome to Anonymous Epidemic Tracker, a privacy-preserving health monitoring system built with Zama's Fully Homomorphic Encryption for the December 2025 Bounty Program."

**Option 2** (More casual):
"Hi, I'm presenting Anonymous Epidemic Tracker, an FHEVM-based system for privacy-preserving epidemic tracking. This is my submission for the Zama Bounty Program December 2025."

**Option 3** (More technical):
"This is Anonymous Epidemic Tracker, a Solidity smart contract demonstrating advanced Fully Homomorphic Encryption techniques for confidential healthcare data aggregation, submitted for Zama's December 2025 Bounty Program."

**Option 4** (Question-based):
"How can we track epidemic data while preserving individual privacy? Anonymous Epidemic Tracker solves this using Zama's FHEVM technology. Let me show you how."

---

## Alternative Closing Lines

**Option 1** (Current):
"This complete implementation demonstrates how FHEVM enables privacy-preserving applications in healthcare. Thank you for watching this Zama Bounty Program submission."

**Option 2** (Call to action):
"All code, tests, and documentation are available in the repository. Thank you for watching, and I look forward to contributing to the FHEVM ecosystem through this Zama Bounty Program submission."

**Option 3** (Impact-focused):
"By enabling privacy-preserving health monitoring, FHEVM technology can increase participation in public health initiatives while protecting individual rights. Thank you for considering this Zama Bounty Program submission."

**Option 4** (Simple):
"Thank you for watching this demonstration of the Anonymous Epidemic Tracker, submitted for Zama's December 2025 Bounty Program."

---

## Backup Script: Super Concise (45 seconds)

If you need an even shorter version:

---

Anonymous Epidemic Tracker demonstrates privacy-preserving health monitoring using Zama's FHEVM for the December 2025 Bounty Program.

The challenge: health authorities need epidemic data, but individuals need privacy. Our solution encrypts individual symptom and exposure reports using Fully Homomorphic Encryption, allowing analysis of aggregated totals without exposing individual data.

The project implements five FHEVM patterns: user decryption, public decryption, encrypted arithmetic, access control, and input validation. Twenty-five comprehensive tests validate all functionality across these concept areas.

The Solidity contract uses encrypted types euint8 and euint16, with functions for period management, encrypted report submission, and aggregate analysis through FHE operations.

Thank you for watching this FHEVM healthcare privacy demonstration, a Zama Bounty Program December 2025 submission.

---

**Word Count**: ~125 words (~50 seconds at normal pace)

---

## Practice Routine

Before final recording:

1. **Read through once silently** - familiarize yourself with flow
2. **Read aloud slowly** - identify difficult phrases
3. **Record a practice take** - listen for clarity
4. **Adjust pacing** - speed up or slow down as needed
5. **Final recording** - 2-3 takes, pick the best

**Estimated Preparation Time**: 15-20 minutes
**Estimated Recording Time**: 10-15 minutes (including retakes)
**Estimated Editing Time**: 10-20 minutes

**Total Time Investment**: 45-60 minutes for complete video with narration

---

## Final Checklist Before Recording

- [ ] Voice warmed up (read aloud for 2-3 minutes)
- [ ] Quiet environment secured
- [ ] Microphone positioned correctly
- [ ] Recording software tested and working
- [ ] Script printed or on second monitor
- [ ] Water nearby (for dry mouth)
- [ ] Phone on silent
- [ ] Background noise eliminated

**You're ready to record! Good luck!**

---

**Note**: This narration is designed to be informative, professional, and engaging while staying within the one-minute constraint. Adjust pacing to match your natural speaking rhythm and the visual content timing.
