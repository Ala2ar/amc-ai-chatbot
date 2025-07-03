from googletrans import Translator

translator = Translator()

def generate_response(question, context_data, language='am'):
    """Simplified response generator without transformers"""
    responses = {
        'en': {
            'news': 'Latest news: ...',
            'schedule': 'Program schedule: ...'
        },
        'am': {
            'news': 'የቅርብ ጊዜ ዜና: ...',
            'schedule': 'የስርጭት ፕሮግራም  : ...'
        }
    }
    
    q = question.lower()
    if 'news' in q:
        return responses[language]['news']
    elif 'schedule' in q or 'program' in q:
        return responses[language]['schedule']
    return responses[language].get('default', 'I cannot answer that yet')