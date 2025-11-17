import { llmService } from './llmService';

export interface TranslationOptions {
  languages: string[];
  sourceLanguage?: string;
}

export class MultiLanguageService {
  /**
   * Supported languages for translation
   */
  private supportedLanguages = [
    'English',
    'Spanish',
    'French',
    'German',
    'Chinese',
    'Japanese',
    'Arabic',
    'Portuguese',
    'Russian',
    'Hindi',
    'Korean',
    'Italian',
    'Dutch',
    'Turkish',
    'Swedish',
    'Polish',
    'Vietnamese',
    'Thai',
    'Greek',
    'Hebrew',
  ];

  /**
   * Translate KYC summary to multiple languages
   */
  async translateSummary(
    summary: string,
    languages: string[]
  ): Promise<Record<string, string>> {
    try {
      if (!process.env.ANTHROPIC_API_KEY || process.env.USE_LLM_TRANSLATION !== 'true') {
        console.warn('LLM translation disabled, returning original summary only');
        return { english: summary };
      }

      try {
        const translations = await llmService.translateSummaryToMultipleLanguages(
          summary,
          languages
        );
        console.log(`Translated summary to ${languages.length} languages`);
        return translations;
      } catch (llmError) {
        console.error('LLM translation failed:', llmError);
        return { english: summary };
      }
    } catch (error) {
      console.error('Error in multi-language service:', error);
      return { english: summary };
    }
  }

  /**
   * Translate a single text to a target language
   */
  async translateText(
    text: string,
    targetLanguage: string,
    sourceLanguage: string = 'English'
  ): Promise<string> {
    try {
      if (!process.env.ANTHROPIC_API_KEY || process.env.USE_LLM_TRANSLATION !== 'true') {
        console.warn('LLM translation disabled, returning original text');
        return text;
      }

      // Validate target language
      if (!this.supportedLanguages.includes(targetLanguage)) {
        throw new Error(
          `Language '${targetLanguage}' is not supported. Supported languages: ${this.supportedLanguages.join(', ')}`
        );
      }

      try {
        const translated = await llmService.translateText(text, targetLanguage, sourceLanguage);
        console.log(`Translated text to ${targetLanguage}`);
        return translated;
      } catch (llmError) {
        console.error(`LLM translation to ${targetLanguage} failed:`, llmError);
        return text;
      }
    } catch (error) {
      console.error('Error in translation service:', error);
      return text;
    }
  }

  /**
   * Detect the language of input text
   */
  async detectLanguage(text: string): Promise<string> {
    try {
      if (!process.env.ANTHROPIC_API_KEY || process.env.USE_LLM_TRANSLATION !== 'true') {
        return 'English';
      }

      try {
        const detectedLanguage = await llmService.detectLanguage(text);
        console.log(`Detected language: ${detectedLanguage}`);
        return detectedLanguage;
      } catch (llmError) {
        console.error('LLM language detection failed:', llmError);
        return 'Unknown';
      }
    } catch (error) {
      console.error('Error detecting language:', error);
      return 'Unknown';
    }
  }

  /**
   * Get list of supported languages
   */
  getSupportedLanguages(): string[] {
    return this.supportedLanguages;
  }

  /**
   * Translate KYC summary and rejection reason to user's preferred language
   */
  async translateKYCResponse(
    summary: string,
    rejectionReason: string | null,
    targetLanguage: string
  ): Promise<{ summary: string; rejectionReason: string | null }> {
    try {
      if (!process.env.ANTHROPIC_API_KEY || process.env.USE_LLM_TRANSLATION !== 'true') {
        return { summary, rejectionReason };
      }

      const [translatedSummary, translatedRejection] = await Promise.all([
        this.translateText(summary, targetLanguage),
        rejectionReason ? this.translateText(rejectionReason, targetLanguage) : Promise.resolve(null),
      ]);

      return {
        summary: translatedSummary,
        rejectionReason: translatedRejection,
      };
    } catch (error) {
      console.error('Error translating KYC response:', error);
      return { summary, rejectionReason };
    }
  }
}

export const multiLanguageService = new MultiLanguageService();
