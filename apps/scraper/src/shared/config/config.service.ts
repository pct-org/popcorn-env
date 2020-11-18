import { LogLevel } from '@nestjs/common'
import * as Joi from '@hapi/joi'

export interface EnvConfig {
  [key: string]: string;
}

export class ConfigService {

  public static readonly NODE_ENV: string = 'NODE_ENV'
  public static readonly PORT: string = 'SCRAPER_PORT'
  public static readonly MONGO_USER: string = 'MONGO_USER'
  public static readonly MONGO_PASS: string = 'MONGO_PASS'
  public static readonly MONGO_URI: string = 'MONGO_URI'
  public static readonly MONGO_PORT: string = 'MONGO_PORT'
  public static readonly MONGO_DATABASE: string = 'MONGO_DATABASE'
  public static readonly CRON_TIME: string = 'CRON_TIME'
  public static readonly SCRAPE_ON_START: string = 'SCRAPE_ON_START'
  public static readonly TRAKT_KEY: string = 'TRAKT_KEY'
  public static readonly TMDB_KEY: string = 'TMDB_KEY'
  public static readonly TVDB_KEY: string = 'TVDB_KEY'
  public static readonly OMDB_KEY: string = 'OMDB_KEY'
  public static readonly FANART_KEY: string = 'FANART_KEY'

  private readonly envConfig: { [key: string]: string }

  constructor() {
    this.envConfig = this.validateInput(process.env)
  }

  /**
   * Get a key from the config
   *
   * @param {string} key
   */
  get(key: string): string {
    return this.envConfig[key] || ''
  }

  /**
   * Get the correct formatted database uri
   */
  get databaseUri(): string {
    const uri = new URL(
      `mongodb://${this.get('MONGO_USER')}:${this.get('MONGO_PASS')}@${this.get('MONGO_URI')}:${this.get('MONGO_PORT')}/${this.get('MONGO_DATABASE')}`
    )

    return uri.href
  }

  /**
   * Is the current env development
   */
  get isDevelopment(): boolean {
    return this.get('NODE_ENV') === 'development'
  }

  static get logLevel(): LogLevel[] {
    const env = process.env.NODE_ENV || 'development'

    if (env === 'development') {
      return ['log', 'error', 'warn', 'debug', 'verbose']
    }

    return ['log', 'error', 'warn']
  }

  /**
   * Ensures all needed variables are set, and returns the validated JavaScript object
   * including the applied default values.
   */
  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      [ConfigService.NODE_ENV]: Joi.string()
        // .valid(['development', 'production', 'test', 'provision'])
        .default('development'),

      [ConfigService.PORT]: Joi.number()
        .default(3000),

      [ConfigService.MONGO_USER]: Joi.string()
        .optional(),

      [ConfigService.MONGO_PASS]: Joi.string()
        .optional(),

      [ConfigService.MONGO_URI]: Joi.string()
        .default('127.0.0.1'),

      [ConfigService.MONGO_PORT]: Joi.number()
        .default('27017'),

      [ConfigService.MONGO_DATABASE]: Joi.string()
        .required(),

      [ConfigService.CRON_TIME]: Joi.string()
        .required(),

      [ConfigService.TRAKT_KEY]: Joi.string()
        .required(),

      [ConfigService.TMDB_KEY]: Joi.string()
        .required(),

      [ConfigService.TVDB_KEY]: Joi.string()
        .required(),

      [ConfigService.OMDB_KEY]: Joi.string()
        .required(),

      [ConfigService.FANART_KEY]: Joi.string()
        .required(),

      [ConfigService.SCRAPE_ON_START]: Joi.boolean()
    })

    const { error, value: validatedEnvConfig } = envVarsSchema.validate(envConfig, { stripUnknown: true })

    if (error) {
      throw new Error(`Config validation error: ${error.message}`)
    }

    return validatedEnvConfig
  }
}
