import os
import requests
from translate import Translator

class AIEngine:
    def __init__(self):
        self.api_key = os.getenv('DEEPSEEK_API_KEY')
        if not self.api_key:
            print("Warning: DeepSeek API key not found in environment variables")
        self.api_url = "https://api.deepseek.com/v1/chat/completions"
    
    def translate_to_english(self, text):
        """Translate Amharic text to English if needed"""
        try:
            translator = Translator(from_lang='am', to_lang='en')
            return translator.translate(text)
        except Exception as e:
            print(f"Translation error: {str(e)}")
            return text
    
    def translate_to_amharic(self, text):
        """Translate English text to Amharic if needed"""
        try:
            translator = Translator(from_lang='en', to_lang='am')
            return translator.translate(text)
        except Exception as e:
            print(f"Translation error: {str(e)}")
            return text

def get_ai_response(question, context, language='am'):
    """Get AI response based on the question and context"""
    ai = AIEngine()
    
    try:
        if not ai.api_key:
            raise ValueError("DeepSeek API key not configured")

        # Format context for better readability
        formatted_context = []
        for item in context:
            formatted_context.append(f"Title: {item['title']}")
            if item.get('content'):
                formatted_context.append(f"Content: {item['content']}")
            if item.get('date'):
                formatted_context.append(f"Date: {item['date']}")
            formatted_context.append("---")
        
        context_text = "\n".join(formatted_context)
        
        # Translate question to English if it's in Amharic
        if language == 'am':
            eng_question = ai.translate_to_english(question)
        else:
            eng_question = question
        
        # Generate response using DeepSeek API
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {ai.api_key}"
        }
        
        payload = {
            "model": "deepseek-chat",
            "messages": [
                {"role": "system", "content": "You are a helpful assistant for Amhara Media Corporation, providing information about news and updates from AMC."},
                {"role": "user", "content": f"""
                Context from AMC website:
                {context_text}
                
                Question: {eng_question}
                
                Please provide a clear and concise answer based on the context above.
                If the context doesn't contain relevant information, please say so.
                """}
            ],
            "temperature": 0.7
        }
        
        response = requests.post(ai.api_url, headers=headers, json=payload)
        response.raise_for_status()
        answer = response.json()['choices'][0]['message']['content']
        
        # Translate response back to Amharic if needed
        if language == 'am':
            return ai.translate_to_amharic(answer)
        return answer
        
    except Exception as e:
        print(f"Error in AI response: {str(e)}")
        if language == 'am':
            return "ይቅርታ፣ ስህተት ተከስቷል። እባክዎ እንደገና ይሞክሩ።"
        return f"Sorry, an error occurred please try again: {str(e)}" 