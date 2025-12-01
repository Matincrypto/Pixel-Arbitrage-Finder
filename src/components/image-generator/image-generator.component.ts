import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { GeminiService } from '../../services/gemini.service';

type AspectRatio = '1:1' | '16:9' | '9:16';

@Component({
  selector: 'app-image-generator',
  imports: [ReactiveFormsModule],
  templateUrl: './image-generator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageGeneratorComponent {
  // Fix: Explicitly type `fb` as `FormBuilder` to fix type inference error on `this.fb.group`.
  private fb: FormBuilder = inject(FormBuilder);
  private geminiService = inject(GeminiService);

  isLoading = signal(false);
  generatedImage = signal<string | null>(null);
  error = signal<string | null>(null);
  
  imageForm = this.fb.group({
    prompt: ['', Validators.required],
    aspectRatio: ['1:1' as AspectRatio, Validators.required]
  });

  async onSubmit(): Promise<void> {
    if (this.imageForm.invalid) {
      return;
    }

    this.isLoading.set(true);
    this.generatedImage.set(null);
    this.error.set(null);

    const { prompt, aspectRatio } = this.imageForm.value;

    try {
      const imageUrl = await this.geminiService.generateImage(prompt!, aspectRatio!);
      this.generatedImage.set(imageUrl);
    } catch (e: any) {
        this.error.set(e.message || 'An unknown error occurred while generating the image.');
    } finally {
      this.isLoading.set(false);
    }
  }
}