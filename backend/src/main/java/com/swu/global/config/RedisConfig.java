package com.swu.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
 import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import com.swu.room.listener.RedisMessageSubscriber;

import org.springframework.beans.factory.annotation.Value;

/**
 * Redis 설정 클래스
 * - RedisConnectionFactory와 RedisTemplate Bean을 등록하여
 *   Redis 서버와의 연결 및 데이터 입출력에 사용할 수 있도록 구성함
 */
@Configuration
public class RedisConfig {
    
    @Value("${spring.data.redis.host}")
    private String host;

    @Value("${spring.data.redis.port}")
    private int port;

    @Value("${spring.data.redis.password}")
    private String password;

    /**
     * Redis 연결 팩토리 빈 등록
     * - Lettuce 클라이언트를 사용하여 Redis에 연결함
     */
    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        RedisStandaloneConfiguration redisStandaloneConfiguration = new RedisStandaloneConfiguration();
        redisStandaloneConfiguration.setHostName(host);
        redisStandaloneConfiguration.setPort(port);
        redisStandaloneConfiguration.setPassword(password);
        return new LettuceConnectionFactory(redisStandaloneConfiguration);
    }

    /**
     * RedisTemplate 빈 등록
     * - key와 value를 모두 문자열(String)로 직렬화하여 저장
     * - Redis 연결 팩토리를 주입받아 사용
     */
    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(connectionFactory);
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setValueSerializer(new Jackson2JsonRedisSerializer<>(Object.class));
        return redisTemplate;
    }

    /**
     * RedisMessageListenerContainer 빈 등록
     * Redis 메시지 수신 컨테이너를 정의함
     * RedisMessageSubscriber를 등록하고, 채널 주체를 지정함
     */
    @Bean
    public RedisMessageListenerContainer redisMessageListenerContainer(
            RedisConnectionFactory connectionFactory,
            RedisMessageSubscriber redisMessageSubscriber,
            ChannelTopic topic) {

        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);
        container.addMessageListener(redisMessageSubscriber, topic); // 직접 등록
        return container;
    }


    /*
     * /pub/sub 모델에서 Redis 채널을 지정하기 위한 채널 주체(topic) 객체
     * 채널 주체는 메시지를 발행하고 구독하는 데 사용되는 채널의 이름을 정의함
     */
    @Bean
    public ChannelTopic channelTopic() {
        return new ChannelTopic("chat");
    }
}
